import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; 
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField'; // Importar TextField de Material-UI
import Button from '@mui/material/Button'; // Importar Button de Material-UI
import { groupBy } from 'lodash';
import Box from '@mui/material/Box'; // Importar Box de Material-UI

const columns = [
  { id: 'fecha_login', label: 'Fecha de Login', minWidth: 170 },
  { id: 'productUrl', label: 'Product URL', minWidth: 170 },
  { id: 'baseUrl', label: 'Base URL', minWidth: 100 },
  { id: 'mimeType', label: 'MIME Type', minWidth: 170 },
  { id: 'nombre', label: 'Nombre', minWidth: 170 },
  { id: 'correo_electronico', label: 'Correo Electrónico', minWidth: 170 },
];

const DataBase = () => {
    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredData, setFilteredData] = useState(null); // Cambio: estado local para los datos filtrados
    const [page, setPage] = useState(0); // Cambio: estado local para la página actual
    const [rowsPerPage, setRowsPerPage] = useState(5); // Cambio: estado local para las filas por página
    const [searchDate, setSearchDate] = useState(''); // Nuevo: estado local para la fecha de búsqueda
    const location = useLocation();
    const { info } = location.state || {}; 

    useEffect(() => {
        fetchDataFromBackend();
    }, []);  

    useEffect(() => {
        filterDataByDate();
    }, [data, selectedDate, searchDate, page, rowsPerPage]); // Cambio: agregar searchDate a las dependencias

    const fetchDataFromBackend = async () => {
        try {
            const response = await fetch('http://localhost:80/data-base');
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener datos desde el backend:', response.status);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    const fetchFilteredDataFromBackend = async (fecha) => { // Cambio: aceptar un parámetro fecha
        try {
            const response = await fetch(`http://localhost:80/filtro?fecha=${fecha}`); // Cambio: usar la fecha en la URL
            if (response.ok) {
                const jsonData = await response.json();
                setFilteredData(jsonData); // Cambio: establecer los datos filtrados
            } else {
                console.error('Error al obtener datos desde el backend:', response.status);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    const filterDataByDate = () => {
        if (!selectedDate && !searchDate) { // Cambio: agregar !searchDate
            setFilteredData(data);
        } else if (selectedDate) { // Cambio: agregar esta condición
            const filtered = data.filter(item => {
                return item.fecha === selectedDate;
            });
            setFilteredData(filtered);
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleSearch = async () => {
        await fetchFilteredDataFromBackend(searchDate); // Cambio: llamar a fetchFilteredDataFromBackend en lugar de setSelectedDate
        setSelectedDate(searchDate);
    };

    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 'calc(90vh - 64px)' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={columns.length} sx={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: '48px', letterSpacing: '0px', color: '#344955' }}>
                                    Base de Datos
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" colSpan={columns.length}>
                                    <TextField
                                        id="search-date"
                                        label="Buscar por fecha"
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleSearch} // Cambio: llamar a handleSearch en lugar de setSelectedDate
                                    >
                                        Buscar
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData && filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#5E6464' } }}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align} title={value}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : truncateText(value, 50)}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={filteredData ? filteredData.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `Mostrando ${from} - ${to} de ${count} filas`}
                />
            </Paper>
        </Box>
    );
};

export default DataBase;
