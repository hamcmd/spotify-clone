import { Song } from "@/types"
import { useUser } from "./useUser";
import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer";

const useOnPlay=(songs: Song[])=> {
    const player = usePlayer();
    const authModal = useAuthModal();
    const {user} = useUser();

    const onPlay = (id: string) => {
        if(!user) {
            authModal.onOpen();
            return;
        }

        player.setActiveId(id);
        player.setActiveIds(songs.map(song => song.id));
    };

    return onPlay;
}

export default useOnPlay;