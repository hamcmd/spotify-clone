"use client";
import useAuthModal from '@/hooks/useAuthModal';
import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { Song } from '@/types';
import type { FC } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { TbPlaylist } from 'react-icons/tb';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';

interface LibraryProps {
    songs: Song[]
}

const Library: FC<LibraryProps> = ({
    songs
}) => {
    const authModal = useAuthModal();
    const {user} = useUser();
    const uploadModal = useUploadModal();

    const onPlay = useOnPlay(songs);

    const onClick = () => {
        if(!user){
            return authModal.onOpen();
        }

        //TODO: check subscription

        return uploadModal.onOpen();
    }

        return (
            <div className="
            flex
            flex-col
            ">
                <div className="
                    flex
                    justify-between
                    items-center
                    px-5
                    pt-4
                    "
                >
                    <div className="
                        inline-flex
                        items-center
                        gap-x-2
                    ">
                        <TbPlaylist className="text-neutral-400" size={26}/>
                        <p className="
                        text-neutral-500 
                        font-medium 
                        text-md"
                        >
                            Your Library
                        </p>
                    </div>
                    <AiOutlinePlus 
                        onClick={onClick}
                        size={20}
                        className="
                            text-neutral-400
                            cursor-pointer
                            hover:text-white
                            transitions
                        "
                    /> 
                </div>
                <div className="
                    flex
                    flex-col
                    gap-y-2
                    mt-4
                    px-3
                "
                >
                    {songs.map((song) => (
                        <MediaItem
                            onClick={(id: string) => onPlay(id)}
                            key={song.id}
                            song={song}
                        />
                        ))
                    }
                </div>
            </div>
            
        );
}
export default Library;