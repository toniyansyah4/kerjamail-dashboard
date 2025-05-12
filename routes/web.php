<?php

use App\Http\Controllers\DomainController;
use App\Http\Controllers\MailboxController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Dashboard Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/domains', fn () => Inertia::render('Domains/Index'))->name('domains.index');
    Route::get('/mailboxes', fn () => Inertia::render('Mailboxes/Index'))->name('mailboxes.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/domains', [DomainController::class, 'index'])->name('domains.index');
    Route::post('/domains', [DomainController::class, 'store'])->name('domains.store');
    Route::post('/domains/{id}/verify', [DomainController::class, 'verify'])->name('domains.verify');
    Route::delete('/domains/{id}', [DomainController::class, 'destroy'])->name('domains.destroy');
    Route::prefix('domains/{domain}')->group(function () {
        Route::get('/mailboxes', [MailboxController::class, 'index'])->name('mailboxes.index');
        Route::post('/mailboxes', [MailboxController::class, 'store'])->name('mailboxes.store');
        Route::put('/mailboxes/{mailbox}', [MailboxController::class, 'update'])->name('mailboxes.update');
        Route::delete('/mailboxes/{mailbox}', [MailboxController::class, 'destroy'])->name('mailboxes.destroy');
        // Route::resource('mailboxes', MailboxController::class)->middleware(['auth', 'verified']);
    });


});

require __DIR__.'/auth.php';
