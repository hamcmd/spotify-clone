import { useState, type FC } from 'react';
import Modal from './Modal';
import useUploadModal from '@/hooks/useUploadModal';
import { FieldValues, SubmitHandler, set, useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import {toast} from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import uniqid from "uniqid";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

interface UploadModalProps {}

const UploadModal: FC<UploadModalProps> = ({}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const uploadModal = useUploadModal();
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();
    const {register, handleSubmit, reset} = useForm<FieldValues>({
        defaultValues: {
            title: "",
            author: "",
            song: null,
            image: null,
        }
    });

    const onChange = (open: boolean) => {
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values)=>{
        try {
            setIsLoading(true);

            const imageFile = values.img[0];
            const songFile = values.song[0];

            if(!imageFile || !songFile || !user) {
                toast.error("Please select a song and an image");
                return;
            }

            const uniqueId = uniqid();

            //Upload songs
            const { 
                data: songData, 
                error: songError
            } = await supabaseClient
            .storage
            .from("songs")
            .upload(
                `song-${values.title}-${uniqueId}`,
                songFile,
                {cacheControl: "3600", upsert: false}
            );

            if(songError) {
                setIsLoading(false);
                return toast.error("Failed to upload song");
            }

            //Upload image

            const { 
                data: imageData, 
                error: imageError
            } = await supabaseClient
            .storage
            .from("images")
            .upload(
                `image-${values.title}-${uniqueId}`,
                imageFile,
                {cacheControl: "3600", upsert: false}
            );

            if(imageError) {
                setIsLoading(false);
                return toast.error("Failed to upload image");
            }

            const {
                error: InsertError
            } = await supabaseClient
            .from("songs")
            .insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                song_path: songData.path,
                image_path: imageData.path,
            });

            if(InsertError) {
                setIsLoading(false);
                return toast.error("Failed to insert song");
            }

            router.refresh();
            setIsLoading(false);
            toast.success("Song uploaded successfully");
            reset();
            uploadModal.onClose();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

        return (
            <Modal
                title="Add a song"
                description="Upload an mp3 file"
                isOpen={uploadModal.isOpen}
                onChange={onChange}
            >
                <form 
                    className="flex flex-col gap-y-4"
                    onSubmit={handleSubmit(onSubmit)} >
                    <Input 
                        id="title"
                        disabled={isLoading}
                        {...register("title", {required: true})}
                        placeholder="Song Title"
                    />
                    <Input 
                        id="author"
                        disabled={isLoading}
                        {...register("author", {required: true})}
                        placeholder="Song author"
                    />
                    <div>
                        <div className="pb-1">
                            Select a song file
                        </div>
                        <Input 
                            id="song"
                            type="file"
                            accept=".mp3"
                            disabled={isLoading}
                            {...register("song", {required: true})}
                    />
                    </div>
                    <div>
                        <div className="pb-1">
                            Select a song cover
                        </div>
                        <Input 
                            id="img"
                            type="file"
                            accept="image/*"
                            disabled={isLoading}
                            {...register("img", {required: true})}
                    />
                    </div>
                    <Button disabled={isLoading} type="submit">
                        Create
                    </Button>
                </form>
            </Modal>
        );
}
export default UploadModal;