import React, { useState, useEffect, useContext } from 'react'

import InfoCard from '../components/Cards/InfoCard'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import PageTitle from '../components/Typography/PageTitle'
import { RevenueIcon, CompleteIcon, PendingIcon, OrderIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../utils/demo/chartsData'
import SectionTitle from '../components/Typography/SectionTitle'
import { AuthContext } from '../context/AuthContext'
import useAuthCheck from '../utils/useAuthCheck'

function Dashboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [ orders, setOrders ] = useState([])

  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [allOrders, setAllOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  // pagination setup
  const resultsPerPage = 5
  //const totalResults = data.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }

  const { token } = useContext(AuthContext);

  useAuthCheck();

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    
    
    fetch(`${process.env.REACT_APP_API_URL}/GetAllOrders`,{
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => { 
        setAllOrders(data.length); 
        data.map(dt => {
          setTotal(ttl => ttl + dt.delivery_cost + Math.floor(dt.total_price) );
        })
        setData(data)
        setLoading(false);
      } )
    .catch( err => { console.log(err); setLoading(false); })

    fetch(`${process.env.REACT_APP_API_URL}/GetPendingOrders`,{
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => { setPendingOrders(data.length) } )
    .catch( err => { console.log(err) })

    fetch(`${process.env.REACT_APP_API_URL}/GetDeliveredOrders`,{
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => { setDeliveredOrders(data.length); } )
    .catch( err => { console.log(err) })

  }, [page])

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Sales" value={`Ksh. ${total}`}>
          <RoundIcon
            icon={RevenueIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Orders" value={allOrders}>
          <RoundIcon
            icon={OrderIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Orders" value={pendingOrders}>
          <RoundIcon
            icon={PendingIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Delivered Orders" value={deliveredOrders}>
          <RoundIcon
            icon={CompleteIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <SectionTitle>Latest Orders</SectionTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client Details</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Delivery Location</TableCell>
              <TableCell>Order Cost</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Delivery Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
              loading && <TableRow>
                <TableCell><div>Loading...</div></TableCell>
              </TableRow>
            }
            {
              !loading && data.length === 0 && <TableRow>
              <TableCell><div>No records To Show</div></TableCell>
            </TableRow>
            }
            { !loading && 
            data.slice(Math.max(data.length - 5, 0)).reverse().map((order, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User image" /> */}
                    <div>
                      <p className="font-semibold">{order.email}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{order.phone_number}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center text-sm">
                        <div>
                        {
                            order.items.map( item => <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{item.type} - <b>{item.productName || item.title}</b> X {item.quantity}</p>)
                        }
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{order.deliveryLocation}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">ksh. {order.total_price + order.delivery_cost}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    Ksh. 
                    { 
                      order.amount_paid ? 
                      <span>{order.amount_paid}</span>
                      :
                      <span>{Math.floor(order.total_price) +  order.delivery_cost}</span> 
                    }
                  </span>
                </TableCell>
                <TableCell>
                  {
                    order.delivery_status === "delivered" ? <Badge type="success">{order.delivery_status}</Badge> : <Badge type="warning">{order.delivery_status}</Badge>
                  }
                </TableCell>
                <TableCell>
                  {/* {new Date(user.date).toLocaleDateString()} */}
                  <span className="text-sm">{order.order_date}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{order.delivery_date}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          {/* <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          /> */}
        </TableFooter>
      </TableContainer>

      {/* <PageTitle>Charts</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Revenue">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>

        <ChartCard title="Traffic">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>
      </div> */}
    </>
  )
}

export default Dashboard
