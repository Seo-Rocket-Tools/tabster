// Supabase configuration
const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
const authHelpers = {
    async signUp(email, password, fullName = null) {
        const signUpData = {
            email: email,
            password: password,
        };

        // Add user metadata if full name is provided
        if (fullName) {
            signUpData.options = {
                data: {
                    full_name: fullName,
                    display_name: fullName
                }
            };
        }

        const { data, error } = await supabaseClient.auth.signUp(signUpData);
        return { data, error };
    },

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    },

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        return { error };
    },

    async resetPassword(email) {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);
        return { data, error };
    },

    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },

    // Users table functions
    async getUserProfile(userId = null) {
        try {
            // If no userId provided, use current user
            if (!userId) {
                const user = await this.getCurrentUser();
                if (!user) return null;
                userId = user.id;
            }

            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async updateUserProfile(updates) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { data: null, error: new Error('Not authenticated') };

            const { data, error } = await supabaseClient
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async updateLastSeen() {
        try {
            const user = await this.getCurrentUser();
            if (!user) return;

            await supabaseClient
                .from('users')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', user.id);
        } catch (err) {
            console.error('Error updating last seen:', err);
        }
    },

    // Spaces table functions
    async getUserSpaces(userId = null) {
        try {
            // If no userId provided, use current user
            if (!userId) {
                const user = await this.getCurrentUser();
                if (!user) return { data: [], error: new Error('Not authenticated') };
                userId = user.id;
            }

            const { data, error } = await supabaseClient
                .from('spaces')
                .select('*')
                .eq('user_id', userId)
                .eq('is_archived', false)
                .order('order_index', { ascending: true });

            return { data, error };
        } catch (err) {
            return { data: [], error: err };
        }
    },

    async createSpace(spaceData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { data: null, error: new Error('Not authenticated') };

            // Get the next order index
            const { data: existingSpaces } = await supabaseClient
                .from('spaces')
                .select('order_index')
                .eq('user_id', user.id)
                .eq('is_archived', false)
                .order('order_index', { ascending: false })
                .limit(1);

            const nextOrderIndex = existingSpaces.length > 0 ? existingSpaces[0].order_index + 1 : 0;

            const { data, error } = await supabaseClient
                .from('spaces')
                .insert({
                    user_id: user.id,
                    name: spaceData.name,
                    description: spaceData.description || null,
                    color: spaceData.color || null,
                    emoji: spaceData.emoji || null,
                    order_index: nextOrderIndex,
                    settings: spaceData.settings || null
                })
                .select()
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async updateSpace(spaceId, updates) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { data: null, error: new Error('Not authenticated') };

            const { data, error } = await supabaseClient
                .from('spaces')
                .update(updates)
                .eq('id', spaceId)
                .eq('user_id', user.id)
                .select()
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },



    async deleteSpace(spaceId) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { error: new Error('Not authenticated') };

            // Hard delete - completely remove the record from the database
            const { error } = await supabaseClient
                .from('spaces')
                .delete()
                .eq('id', spaceId)
                .eq('user_id', user.id);

            return { error };
        } catch (err) {
            return { error: err };
        }
    },

    // Realtime subscription for spaces
    subscribeToSpaces(userId, onUpdate) {
        try {
            const subscription = supabaseClient
                .channel('spaces_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'spaces',
                        filter: `user_id=eq.${userId}`
                    },
                    onUpdate
                )
                .subscribe();

            return subscription;
        } catch (err) {
            console.error('Error setting up spaces subscription:', err);
            return null;
        }
    },



    // Unsubscribe from realtime
    unsubscribeFromSpaces(subscription) {
        if (subscription) {
            supabaseClient.removeChannel(subscription);
        }
    }
}; 