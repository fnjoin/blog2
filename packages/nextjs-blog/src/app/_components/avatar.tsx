import Image from "next/image";
import { ReactNode } from "react";

type Props = {
    name?: string;
    picture?: string;
};

function Avatar({ name, picture }: Props): ReactNode {
    console.log("picture", picture);
    if (!name || !picture) {
        console.log("missing required params in Avatar");
        return <></>;
    }
    return (
        <div className="flex items-center">
            <Image
                src={picture}
                fill={false}
                width={100}
                height={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-12 h-12 rounded-full mr-4"
                alt={name}
            />
            <div className="text-xl font-bold">{name}</div>
        </div>
    );
}

export default Avatar;
