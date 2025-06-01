import {useHeaderHeightAdjustment} from "../useHeaderHeightAdjustment.js";


const Hero = () => {
    const headerHeight = useHeaderHeightAdjustment()

    return (
        <div
            className="w-full bg-amber-100"
            style={{ marginTop: `${headerHeight}px` }}
        >
            <h1>Hero Section</h1>
        </div>
    );
};

export default Hero;