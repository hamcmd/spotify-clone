"use client"
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface LikeButtonProps {
    songId: string;
}

const LikeButton: FC<LikeButtonProps> = ({
    songId
}) => {
    const router = useRouter();
    const {supabaseClient} = useSessionContext();
    const authModal = useAuthModal();
    const {user} = useUser();
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        if(!user?.id) {
            return;
        }

        const fetchData = async () => {
            const {data, error} = await supabaseClient
                .from('liked_songs')
                .select('*')
                .eq('song_id', songId)
                .eq('user_id', user.id)
                .single();

            if(!error && data) {
                setIsLiked(true);
            }
        };

        fetchData();

    }, [songId, user?.id, supabaseClient]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if(!user?.id) {
            authModal.onOpen();
            return;
        }

        if(isLiked) {
            const {error} = await supabaseClient
                .from('liked_songs')
                .delete()
                .eq('song_id', songId)
                .eq('user_id', user.id);

                if(error) {
                    toast.error(error.message);
                } else {
                    setIsLiked(false);
                }

        } else {
            const {error} = await supabaseClient
                .from('liked_songs')
                .insert({
                    song_id: songId,
                    user_id: user.id,
                });


                if(error) {
                    toast.error(error.message);
                } else {
                    setIsLiked(true);
                    toast.success('Liked!')
                }
        }
    }
        return (
           <button
                className="
                    hover:opacity-75
                    transition
                "
                onClick={handleLike}
           >
                <Icon color={isLiked ? "#22c55e" : "white"}/>
           </button>
        );
}
export default LikeButton;