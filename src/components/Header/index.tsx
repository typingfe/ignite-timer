import { Scroll, Timer } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import logoTimer from '../../assets/logo-timer.svg'
import { HeaderContainer } from './styles'

export const Header = () => {
    return (
        <HeaderContainer>
            <img src={logoTimer} />
            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}
