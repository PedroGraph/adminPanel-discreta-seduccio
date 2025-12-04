import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MessageCircle, Search, Calendar, User, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChatContext } from "@/context/ChatContext";

import { chatService, Conversation } from "@/services/chat.service";

export const ChatHistory = ({ embedded = false }: { embedded?: boolean }) => {
    const { toast } = useToast();
    const { reactivateChat } = useChatContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const data = await chatService.getConversations();
            if (data.status) {
                setConversations(data.data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast({
                title: "Error",
                description: "No se pudo cargar el historial de chats",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchConversationDetails = async (id: string) => {
        try {
            const data = await chatService.getConversationDetails(id);
            if (data.success) {
                setSelectedConversation(data.data);
            }
        } catch (error) {
            console.error('Error fetching conversation details:', error);
            toast({
                title: "Error",
                description: "No se pudo cargar los detalles del chat",
                variant: "destructive",
            });
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-600">Activo</Badge>;
            case 'waiting':
                return <Badge className="bg-yellow-600">En Espera</Badge>;
            case 'ended':
                return <Badge className="bg-gray-600">Finalizado</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className={`bg-gray-900 min-h-screen text-white ${embedded ? '' : 'p-6'}`}>
            {!embedded && (
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Historial de Chats</h1>
                    <p className="text-gray-400">Consulta y revisa conversaciones pasadas</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por cliente..."
                                    className="pl-8 bg-gray-700 border-gray-600 text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-400">Cargando...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">No se encontraron chats</div>
                            ) : (
                                <div className="divide-y divide-gray-700">
                                    {filteredConversations.map((chat) => (
                                        <div
                                            key={chat.id}
                                            onClick={() => fetchConversationDetails(chat.id)}
                                            className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors ${selectedConversation?.id === chat.id ? 'bg-gray-700' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium">{chat.customer_name}</div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(chat.started_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-400 truncate max-w-[150px]">
                                                    {chat.messages[0]?.message || 'Sin mensajes'}
                                                </div>
                                                {getStatusBadge(chat.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-2">
                    {selectedConversation ? (
                        <Card className="bg-gray-800 border-gray-700 h-[700px] flex flex-col">
                            <CardHeader className="border-b border-gray-700">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            {selectedConversation.customer_name}
                                        </CardTitle>
                                        <div className="text-sm text-gray-400 mt-1 flex gap-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(selectedConversation.started_at).toLocaleString()}
                                            </span>
                                            {selectedConversation.assigned_user && (
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    Atendido por: {selectedConversation.assigned_user.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {selectedConversation.status === 'ended' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                                                onClick={() => reactivateChat(selectedConversation.id)}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Reanudar
                                            </Button>
                                        )}
                                        {getStatusBadge(selectedConversation.status)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedConversation.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${msg.sender_type === 'admin'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-100'
                                                }`}
                                        >
                                            <div className="text-xs opacity-75 mb-1">{msg.sender_name}</div>
                                            <div className="break-words">{msg.message}</div>
                                            <div className="text-xs opacity-60 mt-1 text-right">
                                                {new Date(msg.sent_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-gray-800 border-gray-700 h-[700px] flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-medium mb-2">Selecciona una conversación</h3>
                                <p>Haz clic en un chat de la lista para ver el historial completo</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>

    );
};
