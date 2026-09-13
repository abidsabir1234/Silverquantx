<?php

use Illuminate\Support\Facades\Route;

// SPA shell — React Router owns everything client-side from here. Kept last and
// excluded from `/api/*` so a future routes/api.php isn't shadowed by this catch-all.
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
