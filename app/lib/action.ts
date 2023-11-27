'use server'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
})

const CreateInvoices = FormSchema.omit({ id: true, date: true })

const createInvoices = async (formData: FormData) => {
    // console.log(formData);

    // const rawFormData = {
    //     customerId: formData.get('customerId'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status')
    // }

    // const rawFormData = Object.fromEntries(formData.entries())
    // console.log(rawFormData);

    const { customerId, status, amount } = CreateInvoices.parse({
        customerId: formData.get('customerId'),
        status: formData.get('status'),
        amount: formData.get('amount')
    })

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

const updateInvoice = async (id: string, formData: FormData) => {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const deleteInvoice = async (id: string) => {

    throw new Error("failed to delete invoice!");

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

export {
    createInvoices,
    updateInvoice,
    deleteInvoice
};