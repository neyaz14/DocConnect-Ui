

import React, { useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/router';

interface SelectFilterProps {
    paramName: string;
    placeholder?: string;
    options: { label: string, value: string }[]
}

function SelectFilter({ paramName, placeholder, options }: SelectFilterProps) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();


    const currentValue = searchParams.get(searchParams.toString()) || "All";

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "All") {
            params.delete(paramName)
        } else if (value) {
            params.set(paramName, value)
        } else {
            params.delete(paramName)
        }


    }

    return (
        <Select
            value={currentValue}
            onValueChange={handleChange}
            disabled={isPending}
        >
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SelectFilter