import React, { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { axiosInstance } from '../config/api'; // Adjust the import based on your setup
import swal from 'sweetalert';

const OrderHistory = () => {
  const targetId = Number(localStorage.getItem('userId'));
  const [orders, setOrders] = useState([]); // State for orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/orders/customer/14`);
        console.log("orders:",orders)
        setOrders(response.data); // Set the fetched data to the orders state
      } catch (error) {
        console.error("Error fetching orders:", error.response);
      }
    };

    fetchOrders();
  }, [targetId]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'order_id', // Column for order ID
        header: 'Order ID',
        size: 100,
      },
      {
        accessorKey: 'customer.name', // Assuming customer name is nested
        header: 'Customer Name',
        size: 150,
      },
      {
        accessorKey: 'pizza.name', // Assuming pizza name is nested
        header: 'Pizza Name',
        size: 150,
      },
      {
        accessorKey: 'restaurant.name', // Assuming restaurant name is nested
        header: 'Restaurant Name',
        size: 150,
      },
      {
        accessorKey: 'status', // Column for order status
        header: 'Status',
        size: 100,
      },
      {
        accessorKey: 'total_price', // Column for order status
        header: 'Total Price',
        size: 100,
      },
    ],
    []
  );

  // Set up the table with columns and fetched data
  const table = useMaterialReactTable({
    columns,
    data: orders, // Use fetched orders data here
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: 'rgba(255, 129, 0, 0.2)', // Set background for the table body cells
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: 'rgba(255, 129, 0, 0.2)', // Set background for the table header cells
      },
    },
    muiTableFooterCellProps: {
      sx: {
        backgroundColor: 'rgba(255, 129, 0, 0.2)', // Set background for the table footer cells
      },
    },
  });

  // Render the table
  return (
    <div style={{ padding: '16px' }}>
      <h2>Order History</h2>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default OrderHistory;
