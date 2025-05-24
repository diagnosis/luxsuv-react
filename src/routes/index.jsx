import { createFileRoute } from '@tanstack/react-router';
import MainContent from '../components/MainContent';

export const Route = createFileRoute('/')({
    component: MainContent,
});