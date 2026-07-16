import { useState } from 'react';

export default function VoucherForm() {
    const [form, setForm] = useState({
        name: '',
        id: '',
        flightNumber: '',
        date: '',
        aircraft: '',
    });

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Crew Name</label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Crew ID</label>

                <input
                    type="text"
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Flight Number</label>

                <input
                    type="text"
                    name="flightNumber"
                    value={form.flightNumber}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Flight Date</label>

                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Aircraft Type</label>

                <select
                    name="aircraft"
                    value={form.aircraft}
                    onChange={handleChange}
                >
                    <option value="">Select Aircraft</option>

                    <option value="ATR">ATR</option>

                    <option value="Airbus 320">
                        Airbus 320
                    </option>

                    <option value="Boeing 737 Max">
                        Boeing 737 Max
                    </option>
                </select>
            </div>

            <button type="submit">
                Generate Vouchers
            </button>
        </form>
    );
}