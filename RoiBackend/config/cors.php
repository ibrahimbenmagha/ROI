<?php








return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://127.0.0.1:8080'], // Match your frontend URL
    'allowed_headers' => ['*'],
    'supports_credentials' => true, // Important for cookies to be sent
];
