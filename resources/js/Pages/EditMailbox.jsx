import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function EditMailbox({ mailbox }) {
  const { data, setData, patch, errors } = useForm({
    password: '',
    quota: mailbox.quota,
    aliases: mailbox.aliases?.join(', ') ?? '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('mailboxes.update', mailbox.id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Password Baru</label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          className="border rounded w-full"
        />
        {errors.password && <div className="text-red-500">{errors.password}</div>}
      </div>

      <div>
        <label>Quota (MB)</label>
        <input
          type="number"
          value={data.quota}
          onChange={(e) => setData('quota', e.target.value)}
          className="border rounded w-full"
        />
        {errors.quota && <div className="text-red-500">{errors.quota}</div>}
      </div>

      <div>
        <label>Alias (pisahkan dengan koma)</label>
        <input
          type="text"
          value={data.aliases}
          onChange={(e) => setData('aliases', e.target.value)}
          className="border rounded w-full"
        />
        {errors.aliases && <div className="text-red-500">{errors.aliases}</div>}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
