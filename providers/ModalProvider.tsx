"use client";
import AuthModal from '@/components/AuthModal';
import UploadModal from '@/components/UploadModal';
import { Children, useEffect, useState, type FC } from 'react';

interface ModalProviderProps {}

const ModalProvider: FC<ModalProviderProps> = ({}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) {
        return null;
    }

        return (
            <>
                <AuthModal />
                <UploadModal/>
            </>
        );
}

export default ModalProvider;