"use client";
import React, { useTransition } from 'react'
import { Button } from '../ui/button';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

interface RefreshButtonProps {
    size?: "sm" | "default" | "lg";
    variant?: "default" | "outline" | "ghost";
    showLabel?: boolean;
}

function RefreshButton({ size, variant, showLabel }: RefreshButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    function handleRefresh() {
        startTransition(() => {
            router.refresh();
        })
    }
    return (
        <Button
            size={size}
            variant={variant}
            onClick={handleRefresh}
            disabled={isPending}
        >
            <RefreshCcw
                className={`h-4 w-4 ${isPending ? "animate-spin" : ""} ${showLabel ? "mr-2" : ""
                    }`}
            />
            {showLabel && "Refresh"}
        </Button>
    )
}

export default RefreshButton