type TicketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;
    return(
        <div>
            <h1>Ticket {id}</h1>
        </div>
    )
}