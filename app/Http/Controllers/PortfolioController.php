<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display the home page.
     */
    public function home(): Response
    {
        return Inertia::render('Home');
    }

    /**
     * Display the projects page.
     */
    public function projects(): Response
    {
        return Inertia::render('Projects');
    }

    /**
     * Display the contact page.
     */
    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    /**
     * Display the code comparator tool.
     */
    public function codeComparator(): Response
    {
        return Inertia::render('CodeComparator/Index');
    }

    /**
     * Display the about page.
     */
    public function about(): Response
    {
        return Inertia::render('About');
    }
}
