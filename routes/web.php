<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PortfolioController;

Route::controller(PortfolioController::class)->group(function () {
    Route::get('/', 'home')->name('home');
    Route::get('/proyectos', 'projects')->name('projects');
    Route::get('/proyectos/comparador', 'codeComparator')->name('projects.comparator');
    Route::get('/sobre-mi', 'about')->name('about');
    Route::get('/contacto', 'contact')->name('contact');
});
