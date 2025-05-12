<?php

namespace App\Http\Controllers;

use App\Models\Mailbox;
use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MailboxController extends Controller
{
    public function index($domainId)
    {
        $domain = Domain::where('id', $domainId)->where('user_id', Auth::id())->firstOrFail();
        $mailboxes = Mailbox::where('domain_id', $domain->id)->latest()->paginate(10);

        return Inertia::render('Mailboxes/Index', [
            'domain' => $domain,
            'mailboxes' => $mailboxes,
        ]);
    }

    public function store(Request $request, $domainId)
    {
        $domain = Domain::where('id', $domainId)->where('user_id', Auth::id())->firstOrFail();

        $request->validate([
            'local_part' => 'required|string',
            'password' => 'required|string|min:6',
            'aliases' => 'nullable|array',
            'aliases.*' => 'email',
            'quota' => 'nullable|integer|min:10',
        ]);

        Mailbox::create([
            'domain_id' => $domain->id,
            'local_part' => $request->local_part,
            'password' => Hash::make($request->password),
            'aliases' => $request->aliases,
            'quota' => $request->quota ?? 10, // Default quota to 10 if not provided
        ]);

        return back()->with('success', 'Mailbox created.');
    }

    public function update(Request $request, Domain $domain, Mailbox $mailbox)
    {

        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'local_part' => 'required|string',
                'password' => 'nullable|string|min:6',
                'quota' => 'nullable|integer|min:10',
                'aliases' => 'nullable|array',
                'aliases.*' => 'email',
            ]);

            $mailbox->local_part = $request->input('local_part', $mailbox->local_part);

            if ($request->filled('password')) {
                $mailbox->password = bcrypt($validated['password']);
            }

            if ($request->filled('quota')) {
                $mailbox->quota = $validated['quota'];
            }

            if ($request->filled('aliases')) {
                $mailbox->aliases = $validated['aliases'];
            }

            $mailbox->save();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Mailbox updated successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to update mailbox: ' . $e->getMessage()]);
        }

        return redirect()->back()->with('success', 'Mailbox updated successfully.');
    }


    public function destroy($domainId, Mailbox $mailbox)
    {
        $domain = Domain::where('id', $domainId)->where('user_id', Auth::id())->firstOrFail();

        abort_if($mailbox->domain_id !== $domain->id, 403);

        $mailbox->delete();
        return response()->json(['success' => true, 'message' => 'Mailbox deleted successfully.']);
    }
}

