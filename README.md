## OpenAI Parameters Explained

### 1. `temperature`
- Controls **randomness/creativity** of the output.
- `0` = very strict & predictable.
- `1` = balanced (default).
- Higher values = more random and creative.

### 2. `top_p`
- Alternative to `temperature` (called **nucleus sampling**).
- Chooses words only from the most likely options.
- `1` = no restriction (default).
- Lower values (e.g., `0.5`) = focuses only on the top probable words.

> ⚡ Usually, adjust **either `temperature` OR `top_p`**, not both.

### 3. `stop`
- Defines a **stop sequence**.
- The model stops generating once it encounters this text.
- Example: `"stop": ["END"]` → output ends when `"END"` appears.

### 4. `max_completion_tokens`
- Maximum number of tokens (words/parts of words) the model can generate.
- Example: `1000` ≈ ~750 words.

### 5. `max_tokens`
- Similar to `max_completion_tokens` (used in older APIs).
- Defines the **length limit** of the response.

### 6. `frequency_penalty`
- Controls how much the model **avoids repeating the same words/phrases**.
- Range: `-2.0` to `2.0`.
- Higher = less repetition.

### 7.
### 7. `presence_penalty`
- Controls how much the model is encouraged to **talk about new topics**.
- Range: `-2.0` to `2.0`.
- Higher = more likely to bring new ideas into the response.
