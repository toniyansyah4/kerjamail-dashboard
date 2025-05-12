import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ auth, domains }) {
    const { data, setData, processing, reset } = useForm({ domain: '' });
    const [filteredDomains, setFilteredDomains] = useState(domains.data);


    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to add this domain?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(route('domains.store'), { domain: data.domain });
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Domain added successfully!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                       
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message || 'Something went wrong!',
                        });
                    }
                     // Reset the form
                    reset();
                    // Optionally, you can refresh the page or update the state to show the new domain
                    Inertia.visit(route('domains.index'));
                } catch (error) {
                    console.error('Error adding domain:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response?.data?.message || 'Something went wrong!',
                    });
                }
            }
        });
    };

    const handleVerify = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to verify this domain?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, verify it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(route('domains.verify', id));
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Domain verified successfully!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message || 'Something went wrong!',
                        });
                    }
                    Inertia.visit(route('domains.index'));
                } catch (error) {
                    console.error('Error verifying domain:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response?.data?.message || 'Something went wrong!',
                    });
                    
                }
            }
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this domain?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(route('domains.destroy', id));
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Domain deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message || 'Something went wrong!',
                        });
                    }
                    Inertia.visit(route('domains.index'));
                } catch (error) {
                    console.error('Error deleting domain:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response?.data?.message || 'Something went wrong!',
                    });
                }
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Domains" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Your Domains</h2>
                            <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
                                <input
                                    type="text"
                                    value={data.domain}
                                    onChange={(e) => setData('domain', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="e.g. example.com"
                                />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={processing}>
                                    Add
                                </button>
                            </form>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search domains..."
                                    onChange={(e) => {
                                        const searchQuery = e.target.value.toLowerCase();
                                        const filtered = domains.data.filter((d) =>
                                            d.domain.toLowerCase().includes(searchQuery)
                                        );
                                        setFilteredDomains(filtered);
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <ul>
                                {filteredDomains.map((d) => (
                                    <li key={d.id} className="border-b py-4">
                                        <div className="flex justify-between items-center">
                                            <strong>{d.domain}</strong>
                                            
                                        </div>
                                        <div>Status: {d.status ? '✅ Verified' : '❌ Not verified'}</div>
                                        {!d.status && (
                                            <div className="text-sm text-gray-700 mt-2">
                                                Please add this TXT record to your DNS:<br />
                                                <code className="bg-gray-100 px-2 py-1 rounded block my-1">Name: kerjamail-verification</code>
                                                <code className="bg-gray-100 px-2 py-1 rounded block">Value: {d.verification_token}</code>
                                                
                                            </div>
                                        )}
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                onClick={() => Inertia.visit(route('mailboxes.index', d.id))}
                                                className="bg-purple-600 text-white px-4 py-1 rounded"
                                            >
                                                Go to Mailboxes
                                            </button>
                                            <button
                                                onClick={() => handleVerify(d.id)}
                                                className=" bg-green-600 text-white px-4 py-1 rounded"
                                            >
                                                Verify Domain
                                            </button>
                                            <button
                                                onClick={() => handleDelete(d.id)}
                                                className="bg-red-600 text-white px-4 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex justify-end items-center">
                                {domains.links.map((link, index) => {
                                    if (typeof link.label == 'string') {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => Inertia.visit(link.url)}
                                                disabled={!link.url}
                                                className={`px-4 py-2 mx-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
