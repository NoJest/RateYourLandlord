import { Button as BaseButton } from "@/components/ui/button"


const Button = ({onClick, children}) => {
    return <BaseButton onclick={onClick}>{children}</BaseButton>
}

export default Button;


export const ButtonNoChildren = ({onClick, _content}) => {
    return <Button onClick={onClick} />
}
