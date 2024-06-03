"use client"
import type { FC } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
    value?: number
    onChange?: (value: number) => void
}

const Slider: FC<SliderProps> = ({
    value = 1,
    onChange
}) => {
    const handleChange = (value: number[]) => {
        if (onChange) {
            onChange(value[0]);
        }
    }
        return (
            <RadixSlider.Root
                className="
                    relative
                    flex
                    items-center
                    select-none
                    touch-none
                    w-full
                    h-10
                "
                defaultValue={[1]}
                value={[value]}
                onValueChange={handleChange}
                max={1}
                step={0.01}
                aria-label="Volume"
            >
                <RadixSlider.Track className="
                    bg-neutral-600
                    relative
                    grow
                    rounded-full
                    h-[3px]
                ">
                    <RadixSlider.Range className="
                        bg-white
                        absolute
                        rounded-full
                        h-full
                    "/>

                </RadixSlider.Track>
            </RadixSlider.Root>
        );
}
export default Slider;