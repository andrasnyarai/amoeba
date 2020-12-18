import styled from 'styled-components'

type WrapperProps = {
  disabled: boolean
}

export const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`

export const Marker = styled.div`
  width: 50%;
  height: 50%;
  pointer-events: none;
  div {
    height: 100%;
  }
`
