import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Star, User, Check } from 'lucide-react';
import { api } from '../services/api';

const AVATARS = [
    { id: 'default', name: 'Novice', price: 0, icon: '😐' },
    { id: 'nerd', name: 'Scholar', price: 50, icon: '🤓' },
    { id: 'robot', name: 'Bot-X', price: 150, icon: '🤖' },
    { id: 'alien', name: 'Alien', price: 300, icon: '👽' },
    { id: 'wizard', name: 'Wizard', price: 500, icon: '🧙‍♂️' },
    { id: 'ninja', name: 'Ninja', price: 800, icon: '🥷' },
    { id: 'king', name: 'Legend', price: 1000, icon: '👑' },
    { id: 'astronaut', name: 'Astro', price: 1500, icon: '👨‍🚀' }
];

const Shop = () => {
    const { user, updateUser } = useAuth();
    const { t } = useLanguage();
    const [msg, setMsg] = useState(null);

    const handleBuy = async (item) => {
        if (user.coins >= item.price) {
            const newCoins = user.coins - item.price;
            const newInventory = [...user.inventory, item.id];

            // Optimistic Update
            updateUser({ coins: newCoins, inventory: newInventory });
            setMsg(`Bought ${item.name}!`);

            // Persist
            try {
                await api.updateUserData(user.id, { coins: newCoins, inventory: newInventory });
            } catch (e) {
                console.error("Sync failed", e);
            }
        } else {
            setMsg("Not enough coins!");
        }
        setTimeout(() => setMsg(null), 2000);
    };

    const handleEquip = async (itemId) => {
        updateUser({ equippedAvatar: itemId });
        try {
            await api.updateUserData(user.id, { equippedAvatar: itemId });
        } catch (e) { console.error(e); }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>NeuroShop 🛒</h2>
                <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 215, 0, 0.2)', border: '1px solid gold' }}>
                    <span style={{ fontSize: '1.5rem' }}>💰</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'gold' }}>{user?.coins || 0}</span>
                </div>
            </div>

            {msg && (
                <div style={{
                    position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)', padding: '1rem 2rem', borderRadius: '50px',
                    zIndex: 1000, border: '2px solid white'
                }}>
                    {msg}
                </div>
            )}

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>Avatars</h3>
            <div className="grid">
                {AVATARS.map(item => {
                    const owned = user?.inventory?.includes(item.id);
                    const equipped = user?.equippedAvatar === item.id;

                    return (
                        <div key={item.id} className="glass-panel" style={{ textAlign: 'center', position: 'relative', border: equipped ? '2px solid #00ff00' : '4px solid #585858' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h4 style={{ margin: '0 0 0.5rem' }}>{item.name}</h4>

                            {!owned && (
                                <div style={{ color: 'gold', fontWeight: 'bold', marginBottom: '1rem' }}>
                                    {item.price} coins
                                </div>
                            )}

                            {owned ? (
                                <button
                                    className="btn"
                                    onClick={() => handleEquip(item.id)}
                                    style={{
                                        width: '100%',
                                        background: equipped ? '#28a745' : '#555',
                                        cursor: equipped ? 'default' : 'pointer'
                                    }}
                                    disabled={equipped}
                                >
                                    {equipped ? 'Equipped' : 'Equip'}
                                </button>
                            ) : (
                                <button
                                    className="btn"
                                    onClick={() => handleBuy(item)}
                                    style={{ width: '100%', background: user.coins >= item.price ? '#00d2ff' : '#333', opacity: user.coins >= item.price ? 1 : 0.5 }}
                                    disabled={user.coins < item.price}
                                >
                                    Buy
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Shop;
