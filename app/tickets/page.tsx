import { db } from "@/db";
import { categories, tickets, users } from "@/db/schema";
import { Button } from "@/components/ui/button"
import TicketForm from "@/components/TicketForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Link from "next/link";
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache";

type FormState = {error?: string};

export default async function TicketsPage() {

    function ticketCategory(ticket: any) {
        const categories = ["Hardware", "Software", "Network", "Other"];
        return(categories[ticket.categoryId - 1])
    }

    const allTickets = await db.query.tickets.findMany({
        with: {
            user: true,
        },
        orderBy: (tickets, { desc }) => [
            desc(tickets.createdAt),
            desc(tickets.id),
        ],
    })

    const allUsers = await db.select().from(users);
    const allCategories = await db.select().from(categories);

    async function newTicket(_previousState: FormState, formData: FormData) {
        "use server";

        const title = String(formData.get("title") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const userId = Number(formData.get("userId"));
        const categoryId = Number(formData.get("categoryId"));

        if(!title) {
            return {error: "Missing title"};
        }

        if(!description) {
            return {error: "Missing description"};
        }

        if(!Number.isInteger(userId)) {
            return {error: "Missing or invalid user"};
        }

        if(!Number.isInteger(categoryId)) {
            return {error: "Missing or invalid category"};
        }

        console.log(`Inserting ${title}, ${description}, ${userId} and ${categoryId} to database`);

        await db.insert(tickets).values({ title, description, userId, categoryId });
        revalidatePath("/tickets");
        return {};
    }

    return(
        <div className="flex flex-col flex-1 items-center justify-center mb-5">
            <div className="flex justify-between flex-row w-full max-w-sm items-center mt-5">
                <h1>Tickets:</h1>
                <TicketForm
                    action={newTicket}
                    allUsers={allUsers}
                    allCategories={allCategories}
                />
            </div>
            {allTickets.map((ticket) => (
                <Card key={ticket.id} className="mx-auto w-full max-w-sm mt-5">
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
                            <Button variant="outline" className="w-full cursor-pointer">Show More</Button>
                        </Link>
                    </div>
                </Card>
            ))}
        </div>
    )
}