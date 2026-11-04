"use client";

import { Button } from "@/components/ui/button"
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

import { useActionState } from "react";

type FormState = { error?: string };
type Option = { id: number; name: string };

type TicketFormProps = {
  action: (
    previousState: FormState,
    formData: FormData
  ) => Promise<FormState>;
  allUsers: Option[];
  allCategories: Option[];
};

export default function TicketForm({
    action,
    allUsers,
    allCategories,
    }: TicketFormProps) {
    const [state, formAction, pending] = useActionState<FormState, FormData>(
        action,
        {}
    );

    return(
        <div>
            <Dialog>
            <DialogTrigger render={<Button variant="outline" className="w-full cursor-pointer max-w-25">Create New</Button>} />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create new ticket</DialogTitle>
                    <DialogDescription>
                    Fill in all the details to create a new ticket
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="flex flex-col gap-4">
                    <FieldGroup>
                    <Field>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" />
                    </Field>
                    <Field>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" />
                    </Field>
                    <Field>
                        <Label htmlFor="userId">Username</Label>
                        <Select name="userId">
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Users</SelectLabel>
                                {allUsers.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                    {user.name}
                                    </SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <Label htmlFor="categoryId">Category</Label>
                        <Select name="categoryId">
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                {allCategories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                    </SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    {state.error && <p role="alert">{state.error}</p>}
                    <Button type="submit" disabled={pending} className="w-full cursor-pointer max-w-25">{pending ? "Creating..." : "Create"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    </div>
    );
}