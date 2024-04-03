import styled from 'styled-components';
import Identicon from 'react-identicons';

const StyledIdenticon = styled(Identicon)(({ theme }) => theme.withMedia({}));

export default StyledIdenticon;
