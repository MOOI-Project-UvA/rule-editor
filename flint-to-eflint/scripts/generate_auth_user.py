import argparse
import importlib
import json
from getpass import getpass
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate an Argon2 credential for rule-editor auth users."
    )
    parser.add_argument("--username", required=True, help="Username to create or update")
    parser.add_argument(
        "--password",
        help="Plaintext password. If omitted, you will be prompted securely.",
    )
    parser.add_argument(
        "--env-file",
        help="Optional path to env file to update AUTH_USERS_JSON in place (for example: secrets.env)",
    )
    return parser.parse_args()


def resolve_password(raw_password: str | None) -> str:
    if raw_password is not None:
        return raw_password

    first = getpass("Password: ")
    second = getpass("Confirm password: ")
    if first != second:
        raise ValueError("Passwords do not match")
    if not first:
        raise ValueError("Password cannot be empty")
    return first


def load_auth_users_from_env_file(env_file: Path) -> dict[str, str]:
    users: dict[str, str] = {}

    if not env_file.exists():
        return users

    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        if key.strip() != "AUTH_USERS_JSON":
            continue
        raw_json = value.strip().strip('"').strip("'")
        if not raw_json:
            return users
        parsed = json.loads(raw_json)
        if isinstance(parsed, dict):
            for username, password_hash in parsed.items():
                normalized_username = str(username).strip()
                normalized_hash = str(password_hash).strip()
                if normalized_username and normalized_hash:
                    users[normalized_username] = normalized_hash

    return users


def write_auth_users_to_env_file(env_file: Path, users: dict[str, str]) -> None:
    serialized = json.dumps(users, separators=(",", ":"))
    auth_line = f"AUTH_USERS_JSON='{serialized}'"

    if env_file.exists():
        lines = env_file.read_text(encoding="utf-8").splitlines()
    else:
        lines = []

    updated_lines: list[str] = []
    replaced = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("AUTH_USERS_JSON="):
            updated_lines.append(auth_line)
            replaced = True
        else:
            updated_lines.append(line)

    if not replaced:
        if updated_lines and updated_lines[-1].strip():
            updated_lines.append("")
        updated_lines.append(auth_line)

    env_file.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    username = args.username.strip()
    if not username:
        raise ValueError("Username cannot be empty")

    password = resolve_password(args.password)
    try:
        argon2_module = importlib.import_module("argon2")
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "argon2 is not installed. Run `pip install -r requirements.txt` in flint-to-eflint first."
        ) from exc

    password_hash = argon2_module.PasswordHasher().hash(password)

    if args.env_file:
        env_path = Path(args.env_file)
        users = load_auth_users_from_env_file(env_path)
        users[username] = password_hash
        write_auth_users_to_env_file(env_path, users)
        print(f"Updated {env_path} with user '{username}' in AUTH_USERS_JSON")
        return

    print("Generated credential:")
    print(f"username={username}")
    print(f"argon2_hash={password_hash}")
    print("\nPaste into env as:")
    print(f"AUTH_USERS_JSON='{{\"{username}\":\"{password_hash}\"}}'")


if __name__ == "__main__":
    main()
