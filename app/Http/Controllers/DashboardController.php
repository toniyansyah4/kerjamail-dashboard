<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Models\Mailbox;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());
        $registerDomainsCount = Domain::where('user_id', Auth::id())->count();
        $activeDomainsCount = Domain::where('user_id', Auth::id())->where('status', true)->count();
        $registeredMailboxesCount = Mailbox::whereHas('domain', function ($q) {
            $q->where('user_id', Auth::id()); 
        })->count();
        $usedStorage = Mailbox::whereHas('domain', function ($q) {
            $q->where('user_id', Auth::id()); 
        })->sum('quota'); // Assuming quota is in MB

        return Inertia::render('Dashboard', [
            'auth' => $user,
            'registerDomainsCount' => $registerDomainsCount,
            'activeDomainsCount' => $activeDomainsCount,
            'registeredMailboxesCount' => $registeredMailboxesCount,
            'usedStorage' => $usedStorage,
        ]);
    }

    public function dashboardAdmin()
    {
        $user = User::find(Auth::id());
        $registerDomainsCount = Domain::count();
        $activeDomainsCount = Domain::where('status', true)->count();
        $registeredMailboxesCount = Mailbox::count();
        $usedStorage = Mailbox::sum('quota'); // Assuming quota is in MB

        return Inertia::render('Admin/Dashboard', [
            'auth' => $user,
            'registerDomainsCount' => $registerDomainsCount,
            'activeDomainsCount' => $activeDomainsCount,
            'registeredMailboxesCount' => $registeredMailboxesCount,
            'usedStorage' => $usedStorage,
        ]);
    }
}
