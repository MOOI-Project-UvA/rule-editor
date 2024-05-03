<template>
    <div class="container">
        <span>Lorem ipsum dolor sit amet,</span>
        <span>consectetur adipiscing elit.</span>
        <span>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
        <span>Ut enim ad minim veniam,</span>
        <span>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
        <span>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.</span>
        <span>Excepteur sint occaecat cupidatat non proident,</span>
        <span>sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
    </div>
</template>
<style>
.container {
    width: 500px;
    /* Adjust width as needed */
    border: 1px solid #ccc;
    /* Optional: just for visual guidance */
    padding: 10px;
    /* Padding inside the div */
    word-wrap: break-word;
    /* Ensures text breaks and wraps as needed */
}

.container span {
    display: inline;
    /* Makes span to flow inline and wrap text */
    margin-right: 5px;
    /* Optional: adds space between spans */
}
</style>