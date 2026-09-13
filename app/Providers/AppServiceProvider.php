<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Preconnect + stylesheet for the brand typeface stack (Inter/Manrope, per resources/css/app.css's --font-sans).
        Blade::directive('fonts', fn () => <<<'HTML'
            <link rel="preconnect" href="https://fonts.bunny.net">
            <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800|manrope:400,500,600,700,800" rel="stylesheet" />
            HTML);
    }
}
