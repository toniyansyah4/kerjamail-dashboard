import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ auth, domain, mailboxes }) {
    const { data, setData, reset, processing, errors } = useForm({
        local_part: '',
        password: '',
        aliases: '',
        quota: 0,
    });
    const [error, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure you want to add a mailbox?',
            text: `${data.local_part}@${domain.domain}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(route('mailboxes.store', domain.id), {
                        local_part: data.local_part,
                        password: data.password,
                        aliases: data.aliases.split(',').map(alias => alias.trim()),
                        quota: data.quota,
                    });

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Mailbox successfully added!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        reset();
                        setError({});
                        Inertia.visit(route('mailboxes.index', domain.id));
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message || 'Something went wrong!',
                        });
                    }
                } catch (error) {
                    console.error('Error adding mailbox:', error);
                    if (error.response && error.response.status === 422) {
                        setError(error.response.data.errors);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'There was an error in the input!',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                    }
                }
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete the mailbox?',
            text: `Mailbox ${id} will be deleted!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(route('mailboxes.destroy', { domain: domain.id, mailbox: id }));

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Mailbox successfully deleted!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        reset();
                        setError({});
                        Inertia.visit(route('mailboxes.index', domain.id));
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message || 'Something went wrong!',
                        });
                    }
                } catch (error) {
                    console.error('Error deleting mailbox:', error);
                }
            }
        });
    };

    const handleEdit = async (mailbox) => {
        setData({
            local_part: mailbox.local_part,
            password: '', // Leave password empty for security
            aliases: mailbox.aliases ? mailbox.aliases.join(', ') : '',
            quota: mailbox.quota || 0,
        });

        Swal.fire({
            title: 'Edit Mailbox',
            html: `
                <input id="swal-local-part" class="swal2-input" placeholder="Local Part" value="${mailbox.local_part}" />
                <input id="swal-password" type="password" class="swal2-input" placeholder="Password (leave empty if unchanged)" />
                <input id="swal-aliases" class="swal2-input" placeholder="Aliases (ex: alias1, alias2)" value="${mailbox.aliases ? mailbox.aliases.join(', ') : ''}" />
                <input id="swal-quota" type="number" class="swal2-input" placeholder="Quota (MB)" value="${mailbox.quota || 0}" />
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    local_part: document.getElementById('swal-local-part').value,
                    password: document.getElementById('swal-password').value,
                    aliases: document.getElementById('swal-aliases').value,
                    quota: document.getElementById('swal-quota').value,
                };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedData = result.value;
                    const response = await axios.put(route('mailboxes.update', { domain: domain.id, mailbox: mailbox.id }), {
                        local_part: updatedData.local_part,
                        password: updatedData.password,
                        aliases: updatedData.aliases.split(',').map(alias => alias.trim()),
                        quota: updatedData.quota,
                    });

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Mailbox successfully updated!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        reset();
                        setError({});
                        Inertia.visit(route('mailboxes.index', domain.id));
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message || 'Something went wrong!',
                        });
                    }
                } catch (error) {
                    console.error('Error updating mailbox:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                }
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mailboxes" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl mb-4">Mailboxes for {domain.domain}</h1>

                            <form onSubmit={handleSubmit} className="mb-6">
                                <div className="">
                                    <div>
                                        <label
                                            htmlFor="LocalPart"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Local Part
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="local part (ex: support)"
                                            value={data.local_part}
                                            onChange={e => setData('local_part', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {error && error["local_part"] && (
                                            <div className="text-red-500">
                                                {error["local_part"][0]}
                                            </div>
                                        )}
                                    </div>
                                    <span>@{domain.domain}</span>
                                    <div>
                                        <label
                                            htmlFor="Password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Password
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {error && error["password"] && (
                                            <div className="text-red-500">
                                                {error["password"][0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="Aliases"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Aliases
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Aliases (ex: alias1, alias2)"
                                            value={data.aliases}
                                            onChange={e => setData('aliases', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {error && error["aliases"] && (
                                            <div className="text-red-500">
                                                {error["aliases"][0]}
                                            </div>
                                        )}
                                        {error && error["aliases.0"] && (
                                            <div className="text-red-500">
                                                {error["aliases.0"][0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="Quota"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Quota (MB)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Quota (ex: 1024)"
                                            value={data.quota}
                                            onChange={e => setData('quota', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {error && error["quota"] && (
                                            <div className="text-red-500">
                                                {error["quota"][0]}
                                            </div>
                                        )}
                                    </div>
                                    {/* button back */}
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-1 rounded mt-4 mr-2"
                                        onClick={() => Inertia.visit(route('domains.index'))}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-1 rounded mt-4"
                                        disabled={processing}
                                    >
                                        Add
                                    </button>
                                </div>
                                {errors.local_part && <div className="text-red-500">{errors.local_part}</div>}
                                {errors.password && <div className="text-red-500">{errors.password}</div>}
                            </form>

                            <table className="w-full text-left border">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Email</th>
                                        <th className="border px-4 py-2">Quota</th>
                                        <th className="border px-4 py-2">Aliases</th>
                                        <th className="border px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mailboxes && mailboxes.data && mailboxes.data.map((mailbox) => (
                                        <tr key={mailbox.id}>
                                            <td className="border px-4 py-2">
                                                {mailbox.local_part}@{domain.domain}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {mailbox.quota} MB
                                            </td>
                                            <td className="border px-4 py-2">
                                                {mailbox.aliases ? mailbox.aliases.join(', ') : '-'}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                    onClick={() => handleDelete(mailbox.id)}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                                                    onClick={() => handleEdit(mailbox)}
                                                >
                                                    Edit
                                                </button>
                                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
