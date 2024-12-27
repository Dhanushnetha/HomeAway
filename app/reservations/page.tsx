import CountryFlagAndName from "@/components/card/CountryFlagAndName";
import EmptyList from "@/components/home/EmptyList";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchReservations } from "@/utils/actions";
import { formatCurrency, formatDate } from "@/utils/format";
import Link from "next/link";

async function ReservationsPage() {
    const reservations = await fetchReservations();
    if(reservations.length == 0) return <EmptyList/>
  
    return (
      <div className="mt-16">
        <h4 className="mb-4 capitalize">total reservations : {reservations.length}</h4>
        <Table>
          <TableCaption>A list of your recent reservations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation)=>{
              const {checkIn, checkOut, totalNights, orderTotal, id, property:{id:propertyId, name, country}} = reservation;
              const startDate = formatDate(checkIn);
              const endDate = formatDate(checkOut);
              return <TableRow key={id}>
                <TableCell>
                  <Link href={`/properties/${propertyId}`} className="underline text-muted-foreground tracking-wide">{name}</Link>
                </TableCell>
                <TableCell>
                  <CountryFlagAndName countryCode={country} />
                </TableCell>
                <TableCell>
                  {totalNights}
                </TableCell>
                <TableCell>
                  {formatCurrency(orderTotal)}
                </TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>                
              </TableRow>
            })}
          </TableBody>
        </Table>
      </div>
    )
}

export default ReservationsPage