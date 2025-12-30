import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/lib/api/admin";
import { useChangePassword } from "@/hooks/use-admin";
import Spinner from "@/components/ui/spinner";
import { useEffect } from "react";
import { LuLock } from "react-icons/lu";

const changePasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
    user: AdminUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({
    user,
    open,
    onOpenChange,
}: ChangePasswordDialogProps) => {
    const changePasswordMutation = useChangePassword();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    const onSubmit = (data: ChangePasswordFormValues) => {
        if (!user) return;

        changePasswordMutation.mutate(
            { id: user.id, data },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter a new password for user <strong>{user?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={changePasswordMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={changePasswordMutation.isPending}>
                                {changePasswordMutation.isPending && (
                                    <Spinner className="mr-2 h-4 w-4 text-white" />
                                )}
                                Change Password
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
