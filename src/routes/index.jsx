import { createFileRoute } from '@tanstack/react-router';
import Hero from '../components/Hero.jsx';

export const Route = createFileRoute('/')({
    component: Hero,
});

