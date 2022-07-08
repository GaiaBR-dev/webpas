import { Table, TableCell, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import { Checkbox, Typography, Toolbar, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useState } from "react";
import { alpha } from '@mui/material/styles';

const tableStyle ={

    '& thead th':{
        color: '#fff',
        backgroundColor: 'secondary.main'
    },
    '& tbody tr:hover':{
        backgroundColor: "#ddd",
        cursor: 'pointer'
    }
}

export default function useTable(records, headCells,filterFn){
    
    const pages = [10, 25, 100, 500]
    const [page,setPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(pages[page])
    const [order,setOrder] = useState()
    const [orderBy,setOrderBy] = useState()

    const TblContainer = props =>{
        const {style, numSelected, tableTitle, deleteSelected} = props
        let tStyle ={
            ...style,
            ...tableStyle
        }
        return(
            <>
                <Toolbar
                    sx={{
                        ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                        }),
                    }}
                >
                    {numSelected > 0 ? (<>
                        <Typography
                            sx={{ flex: '1 1 100%',fontSize:'17px',fontWeight:'510',color:"#666" }}
                            color="inherit"
                            variant="subtitle1"
                            component="p"
                        >
                            {numSelected} selecionado(s)
                        </Typography>
                        <Tooltip title="Deletar">
                        <IconButton color="error" onClick={deleteSelected}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    </>) : (<>
                        <Typography
                            sx={{ flex: '1 1 100%',fontSize:'17px',fontWeight:'510',color:"#666" }}
                            variant="h6"
                            id="tableTitle"
                            component="p"
                        >
                            {tableTitle}
                        </Typography>
                        
                    </>)}
                </Toolbar>
                <Table sx ={tStyle}>
                    {props.children}
                </Table>
            </>
        )
    }
    
    const TblHead = props =>{
        const {onSelectAllClick, numSelected, rowCount} = props

        const handleSortRequest = cellId =>{
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(cellId)
        }

        return (<TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map(headCell =>(
                    <TableCell key={headCell.id} sx={{padding:1}} sortDirection={orderBy===headCell.id?order:false}>
                        <TableSortLabel
                            active={orderBy===headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() =>{handleSortRequest(headCell.id)}}
                        >
                            {headCell.label}
                        </TableSortLabel>
                        </TableCell>
                ))}
            </TableRow>
            
        </TableHead>)
    }

    const handleChangePage = ( event, newPage) =>{
        setPage(newPage)
    }

    const handleChangeRowsPerPage = ( event) =>{
        setRowsPerPage(parseInt(event.target.value,10))
        setPage(0)
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }
      

    const recordsAfterPagingAndSorting = () =>{
        return stableSort(filterFn.fn(records),getComparator(order,orderBy))
            .slice(page*rowsPerPage,(page+1)*rowsPerPage)
    }


    const TblPagination = () =>{
        return(
            <TablePagination
                labelRowsPerPage= "Linhas por Página"
                rowsPerPageOptions={pages}
                rowsPerPage={rowsPerPage}
                component="div"
                count={records.length}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        )
    }

    return{
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }
}