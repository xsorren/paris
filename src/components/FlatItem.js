import { Link } from "react-router-dom";
import styled from "styled-components";

const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Item = styled.div`
  background: var(--bg-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-xl);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  width: 100%;
  max-width: 350px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const ItemImage = styled.div`
  width: 100%;
  height: 240px;
  overflow: hidden;
  background-color: var(--bg-light);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform var(--transition-base);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ItemDescription = styled.div`
  padding: var(--space-l);
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-m);
  gap: var(--space-l);
`;

const ItemTitle = styled.span`
  font-weight: var(--font-bold);
  color: var(--primary);
  font-size: var(--font-sm);
  line-height: 1.4;
  flex: 1;
`;

const ItemPrice = styled.span`
  font-weight: var(--font-bold);
  font-size: var(--font-lg);
  color: var(--primary);
  white-space: nowrap;
`;

const ItemFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  margin-bottom: var(--space-m);
`;

const ItemFeature = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-s);
  font-size: var(--font-sm);
  color: var(--text-secondary);

  i {
    color: var(--primary);
    width: 16px;
    text-align: center;
  }
`;

const ItemButton = styled(Link)`
  display: block;
  width: 100%;

  button {
    width: 100%;
    padding: var(--space-m) var(--space-l);
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-weight: var(--font-bold);
    font-size: var(--font-sm);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const FlatItem = ({slug}) => {
  return (
    <ItemWrapper>
      <Item>
        <ItemImage>
          <img src="/img/product1.jpeg" alt="flat" />
        </ItemImage>
        <ItemDescription>
          <ItemHeader>
            <ItemTitle>Lorem ipsum dolor sit amet consectetur adipiscing elit</ItemTitle>
            <ItemPrice>$1000</ItemPrice>
          </ItemHeader>
          <ItemFeatures>
            <ItemFeature>
              <i className="fas fa-check-circle" />
              <span>Lorem ipsum dolor</span>
            </ItemFeature>
            <ItemFeature>
              <i className="fas fa-check-circle" />
              <span>Lorem ipsum</span>
            </ItemFeature>
          </ItemFeatures>
          <ItemButton to={`/flat/${slug}`}>
            <button>Ver Detalle</button>
          </ItemButton>
        </ItemDescription>
      </Item>
    </ItemWrapper>
  );
};

export default FlatItem;