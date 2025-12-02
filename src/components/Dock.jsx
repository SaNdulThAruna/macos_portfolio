// javascript
import React, {useRef} from 'react'
import {Tooltip} from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import {dockApps} from '#constants/index.js'
import {useGSAP} from "@gsap/react";
import gsap from "gsap";

const Dock = () => {
    const dockRef = useRef(null)

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');

        const animateIcons = (clientX) => {
            const dockRect = dock.getBoundingClientRect();
            const mouseX = clientX - dockRect.left;

            icons.forEach((icon) => {
                const rect = icon.getBoundingClientRect();
                const center = rect.left - dockRect.left + rect.width / 2;
                const distance = Math.abs(mouseX - center);

                // Use squared distance Gaussian so effect falls off with distance
                const intensity = Math.exp(-(distance ** 2.5) / 20000);
                const clamped = Math.max(0, Math.min(1, intensity));

                // avoid stacking tweens
                gsap.killTweensOf(icon);

                gsap.to(icon, {
                    scale: 1 + 0.25 * clamped,
                    y: -15 * clamped,
                    duration: 0.2,
                    ease: 'power1.out'
                })
            })
        }

        const handleMouseMove = (e) => {
            animateIcons(e.clientX);
        }

        const resetIcons = () => {
            icons.forEach((icon) => {
                gsap.killTweensOf(icon);
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power1.out'
                })
            })
        }

        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', resetIcons);
        }
    }, []);

    const toggleApp = (app) => {

    }

    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container">
                {dockApps.map((app) => {
                    const {id, name, icon, canOpen} = app
                    return (
                        <div key={id ?? name} className="relative flex justify-center">
                            <button
                                type="button"
                                className="dock-icon"
                                aria-label={name}
                                data-tooltip-id="dock-tooltip"
                                data-tooltip-content={name}
                                data-tooltip-delay-show={400}
                                onClick={() => toggleApp({id, canOpen})}
                            >
                                <img
                                    src={`/images/${icon}`}
                                    alt={name}
                                    loading="lazy"
                                    className={canOpen ? '' : 'opacity-60'}
                                />
                            </button>
                        </div>
                    )
                })}

                <Tooltip id={'dock-tooltip'} place="top" className={'tooltip'}/>
            </div>
        </section>
    )
}

export default Dock
