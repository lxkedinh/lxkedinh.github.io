import styled from "styled-components";

interface StyledBookmarkProps {
  href: string;
}

export const StyledBookmark = styled.a.attrs((props: StyledBookmarkProps) => ({
  href: props.href,
}))`
  font-size: 24px;
  font-family: "haxrcorp";
  text-decoration: none;
  line-height: 16px;
  color: #e6e6e6;

  &:hover {
    text-decoration: underline;
  }
`;
