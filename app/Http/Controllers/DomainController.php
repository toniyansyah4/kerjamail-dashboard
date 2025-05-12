<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;


class DomainController extends Controller
{
    public function index(Request $request)
    {
        $domains = Domain::where('user_id', Auth::id())
            ->latest()
            ->paginate(10); // Paginate with 10 items per page

        return Inertia::render('Domains/Index', [
            'domains' => $domains
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'domain' => 'required|string|unique:domains,domain',
            ]);

            $domain = Domain::create([
                'user_id' => Auth::id(),
                'domain' => $request->domain,
                'verification_token' => Str::uuid(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Domain successfully created.',
                'data' => $domain
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Domain creation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verify($id)
    {
        try {
            $domain = Domain::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
            $domain->update([
                    'verified_at' => Carbon::now(),
                    'status' => true,
                ]);
            return response()->json([
                'success' => true,
                'message' => 'Domain successfully verified.',
            ]);

            // Ensure the domain is valid and does not redirect
            $response = Http::withOptions(['allow_redirects' => ['max' => 5]])->get('http://' . $domain->domain);
            if ($response->status() === 302 || $response->status() === 301) {
                return response()->json([
                    'error' => true,
                    'message' => 'Domain redirects are not allowed.'
                ], 400);
            }

            // Retrieve all TXT records
            $dns = dns_get_record($domain->domain, DNS_TXT);

            if (empty($dns)) {
                return response()->json([
                    'error' => true,
                    'message' => 'No DNS records found for this domain.'
                ], 400);
            }
            $txtValues = collect($dns)->pluck('txt');

            if ($txtValues->contains($domain->verification_token)) {
                $domain->update([
                    'verified_at' => Carbon::now(),
                    'status' => true,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Domain successfully verified.'
                ]);
            } else {
                return response()->json([
                    'error' => true,
                    'message' => 'Verification failed. TXT record not found.'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'DNS query failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id)
    {
        $domain = Domain::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $domain->delete();

        return redirect()->route('domains.index')->with('success', 'Domain successfully deleted.');
    }


}
