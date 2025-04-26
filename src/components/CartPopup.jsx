import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button, Badge, InputNumber } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const CartPopup = () => {
  const { cart, total, isOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <PopupOverlay onClick={closeCart}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <PopupHeader>
          <h3>Your Cart</h3>
          <CloseButton onClick={closeCart}>
            <CloseOutlined />
          </CloseButton>
        </PopupHeader>

        <CartItems>
          {cart.length === 0 ? (
            <EmptyCart>Your cart is empty</EmptyCart>
          ) : (
            cart.map(item => (
              <CartItem key={item.id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>K{item.price.toFixed(2)}</ItemPrice>
                  <QuantityControl>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, value)}
                    />
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      Remove
                    </RemoveButton>
                  </QuantityControl>
                </ItemDetails>
              </CartItem>
            ))
          )}
        </CartItems>

        {cart.length > 0 && (
          <CartFooter>
            <TotalAmount>
              Total: K{total.toFixed(2)}
            </TotalAmount>
            <CheckoutButton type="primary" size="large">
              Proceed to Checkout
            </CheckoutButton>
          </CartFooter>
        )}
      </PopupContent>
    </PopupOverlay>
  );
};

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  width: 400px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

const CartItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 5px 0;
  color: #333;
`;

const ItemPrice = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

const QuantityControl = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartFooter = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: right;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
`;

export default CartPopup; 