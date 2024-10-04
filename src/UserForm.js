import {useState, useEffect } from 'react'
import axios from 'axios'
function UserForm(){
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: ''
        }
    })

    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:8080/user/');
        setUsers(res.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData) {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({
                ...formData,
                address: { ...formData.address, [name]: value }
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editUserId) {
            await axios.put(`http://localhost:8080/user/${editUserId}`, formData);
        } else {
            await axios.post('http://localhost:8080/user/', formData);
        }
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            address: {
                street: '',
                city: '',
                state: '',
                postalCode: ''
            }
        });
        setEditUserId(null);
        fetchUsers();
    };

    const handleEdit = (user) => {
        setFormData(user);
        setEditUserId(user._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/user/${id}`);
        fetchUsers();
    };

    return (
        <div>
            <h1>User Details</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required /><br></br>
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required /><br></br>
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required /><br></br>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
 <h3>Address</h3>
                <input type="text" name="street" placeholder="Street" value={formData.address.street} onChange={handleChange} required /><br></br>
                <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleChange} required /><br></br>
                <input type="text" name="state" placeholder="State" value={formData.address.state} onChange={handleChange} required /><br></br>
                <input type="text" name="postalCode" placeholder="Postal Code" value={formData.address.postalCode} onChange={handleChange} required /><br></br>
                
                <button type="submit">{editUserId ? 'Update User' : 'Add User'}</button>
            </form>

            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.firstName} {user.lastName} - {user.phoneNumber} - {user.email} - {user.address.street}, {user.address.city}, {user.address.state}, {user.address.postalCode}
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );

}
export default UserForm;