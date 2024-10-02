import React, { useMemo,useCallback, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { axiosInstance } from '../../config/api';
import { MenuItem, Select } from '@mui/material'; // Import MUI components for dropdown

const Orders = () => {
  const [orders, setOrders] = useState([]); // State for orders

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('orders/restaurant/6');
      setOrders(response.data); // Set the fetched data to the orders state
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  },[]);
  useEffect(() => {

    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      // Update the orders state with the new order data returned from the server
      fetchOrders()
      // setOrders((prevOrders) => 
      //   prevOrders.map((order) => 
      //     order.order_id === orderId ? response.data.order : order
      //   )
      // );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Define columns for the orders table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'order_id', // Column for order ID
        header: 'Order ID',
        size: 100,
      },
      {
        accessorKey: 'customer.name', // Column for customer name
        header: 'Customer Name',
        size: 150,
      },
      {
        accessorKey: 'pizza.name', // Column for pizza name
        header: 'Pizza Name',
        size: 150,
      },
      {
        accessorKey: 'restaurant.name', // Column for restaurant name
        header: 'Restaurant Name',
        size: 150,
      },
      {
        accessorKey: 'status', // Column for order status
        header: 'Status',
        size: 150,
        // Display the current status fetched from the backend
        Cell: ({ row }) => (
          <span>{row.original.status}</span>
        ),
      },
      {
        accessorKey: 'action', // New column for action
        header: 'Action',
        size: 150,
        Cell: ({ row }) => (
          <Select
            defaultValue={row.original.status} // Display current status as default value
            onChange={(e) => handleStatusChange(row.original.order_id, e.target.value)}
          >
            {/* Add your desired statuses here */}
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        ),
      },
    ],
    []
  );

  // Set up the table with columns and fetched data
  const table = useMaterialReactTable({
    columns,
    data: orders, // Use fetched orders data here
  });

  // Render the table
  return <MaterialReactTable table={table} />;
};

export default Orders;
