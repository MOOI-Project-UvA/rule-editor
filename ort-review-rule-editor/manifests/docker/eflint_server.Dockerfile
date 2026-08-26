# Stage 1: pull the eflint-server binary out of the eflint image
FROM eflint AS eflint-bin

# Stage 2: intermediary service
FROM python:3.12-slim

# Copy the eflint-server binary
COPY --from=eflint-bin /usr/bin/eflint-server /usr/bin/eflint-server

WORKDIR /app

COPY requirements.txt .
# GHC-compiled binaries need libgmp and libtinfo at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
		libgmp10 \
		libtinfo6 \
	&& rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

# EFLINT_SPEC_PATH can be overridden to mount a custom spec file
ENV EFLINT_SPEC_PATH=/app/default_spec.eflint
ENV EFLINT_PORT=9001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
