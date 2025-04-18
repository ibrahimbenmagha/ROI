<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register the auth middleware
        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'check.role' => \App\Http\Middleware\CheckUserRole::class,

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->withProviders([
        // Ensure AuthServiceProvider is registered
        \App\Providers\AuthServiceProvider::class,
        // Register JWT service provider
        \Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
    ])
    ->create();