import { db } from "@/db";
import { categories, tickets } from "@/db/schema";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export default async function TicketsPage() {

    function ticketCategory(ticket: any) {
        const categories = ["Hardware", "Software", "Network", "Other"];
        return(categories[ticket.categoryId - 1])
    }

    const tickets = await db.query.tickets.findMany({
        with: {
            user: true,
        }
    })

    return(
        <div className="flex flex-col flex-1 items-center justify-center">
            <h1 className="mt-5">Tickets:</h1>
            {tickets.map((ticket) => (
                <Card key={ticket.id} className="mx-auto w-full max-w-sm mt-3 mb-3">
                    <CardHeader>
                        <div className="flex flex-wrap justify-between">
                            <h1 className="font-bold">{ticket.title}</h1>
                            {ticket.status === "open" && (
                                <div className="bg-green-950 p-2 rounded-xl">
                                    <p>Open</p>
                                </div>
                            )}
                            {ticket.status === "in-progress" && (
                                <div className="bg-blue-950 p-2 rounded-xl">
                                    <p>In Progress</p>
                                </div>
                            )}
                            {ticket.status === "resolved" && (
                                <div className="bg-gray-950 p-2 rounded-xl">
                                    <p>Resolved</p>
                                </div>
                            )}
                        </div>
                        <p>Ticket Details:</p>
                        <div className="flex flex-col gap-2 bg-gray-950 p-2 mt-1 rounded-lg">
                            <p>{ticket.user.name}</p>
                            <p>
                                {new Intl.DateTimeFormat("en-FI", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                    timeZone: "Europe/Helsinki",
                                }).format(ticket.createdAt)}
                            </p>
                            <p>{ticketCategory(ticket)}</p>
                        </div>
                    </CardHeader>
                    <CardDescription className="ml-4">
                        <p>{ticket.description}</p>
                    </CardDescription>
                    <div className="ml-5 mr-5">
                        <Link href={`/tickets/${ticket.id}`}>
                            <Button variant="outline" className="w-full cursor-pointer">More</Button>
                        </Link>
                    </div>
                </Card>
            ))}
        </div>
    )
}