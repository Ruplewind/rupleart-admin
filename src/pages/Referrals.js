import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { AuthContext } from '../context/AuthContext';

function Referrals() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useContext(AuthContext);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/referral_stats`,{
          headers: {
            'Authorization':`Bearer ${token}`
          }
        })
        .then( data => data.json())
        .then( data => {
            setData(data)
            setLoading(false);
        } )
        .catch( err => { console.log(err) })
      },[])

  return (
    <div>
        <PageTitle>Referrals Counter</PageTitle>

        <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Code</TableCell>
              <TableCell>No. of Users</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            data.length === 0 ? <TableCell>No Records</TableCell> :
            
            data.map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                    <span className="text-sm">{dt.referralCode}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{dt.totalUsers}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
        </TableFooter>
      </TableContainer>
    </div>
  )
}

export default Referrals